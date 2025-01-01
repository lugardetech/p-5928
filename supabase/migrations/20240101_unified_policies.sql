-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Users can view companies they belong to"
    ON public.companies FOR SELECT
    USING (
        id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their companies"
    ON public.companies FOR UPDATE
    USING (
        id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Integrations Policies
CREATE POLICY "Users can view their company integrations"
    ON public.integrations FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their company integrations"
    ON public.integrations FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Products Policies
CREATE POLICY "Users can view company products"
    ON public.products FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company products"
    ON public.products FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Categories Policies
CREATE POLICY "Users can view company categories"
    ON public.categories FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company categories"
    ON public.categories FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Product Variations Policies
CREATE POLICY "Users can view company product variations"
    ON public.product_variations FOR SELECT
    USING (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage company product variations"
    ON public.product_variations FOR ALL
    USING (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Price History Policies
CREATE POLICY "Users can view company price history"
    ON public.price_history FOR SELECT
    USING (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can add company price history"
    ON public.price_history FOR INSERT
    WITH CHECK (
        product_id IN (
            SELECT id 
            FROM public.products 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Orders Policies
CREATE POLICY "Users can view company orders"
    ON public.orders FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company orders"
    ON public.orders FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Order Items Policies
CREATE POLICY "Users can view company order items"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage company order items"
    ON public.order_items FOR ALL
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Order History Policies
CREATE POLICY "Users can view company order history"
    ON public.order_history FOR SELECT
    USING (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can add company order history"
    ON public.order_history FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id 
            FROM public.orders 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Integration Mappings Policies
CREATE POLICY "Users can view company integration mappings"
    ON public.integration_mappings FOR SELECT
    USING (
        integration_id IN (
            SELECT id 
            FROM public.integrations 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage company integration mappings"
    ON public.integration_mappings FOR ALL
    USING (
        integration_id IN (
            SELECT id 
            FROM public.integrations 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Notifications Policies
CREATE POLICY "Users can view their notifications"
    ON public.notifications FOR SELECT
    USING (
        user_id = auth.uid() OR
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Support Tickets Policies
CREATE POLICY "Users can view company support tickets"
    ON public.support_tickets FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company support tickets"
    ON public.support_tickets FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Audit Log Policies
CREATE POLICY "Users can view company audit logs"
    ON public.audit_log FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Accounts Receivable Policies
CREATE POLICY "Users can view company accounts receivable"
    ON public.accounts_receivable FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company accounts receivable"
    ON public.accounts_receivable FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Accounts Payable Policies
CREATE POLICY "Users can view company accounts payable"
    ON public.accounts_payable FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company accounts payable"
    ON public.accounts_payable FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Cash Flow Policies
CREATE POLICY "Users can view company cash flow"
    ON public.cash_flow FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company cash flow"
    ON public.cash_flow FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Suppliers Policies
CREATE POLICY "Users can view company suppliers"
    ON public.suppliers FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company suppliers"
    ON public.suppliers FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Purchases Policies
CREATE POLICY "Users can view company purchases"
    ON public.purchases FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company purchases"
    ON public.purchases FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Purchase Items Policies
CREATE POLICY "Users can view company purchase items"
    ON public.purchase_items FOR SELECT
    USING (
        purchase_id IN (
            SELECT id 
            FROM public.purchases 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage company purchase items"
    ON public.purchase_items FOR ALL
    USING (
        purchase_id IN (
            SELECT id 
            FROM public.purchases 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Customers Policies
CREATE POLICY "Users can view company customers"
    ON public.customers FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company customers"
    ON public.customers FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Customer Service Policies
CREATE POLICY "Users can view company customer service"
    ON public.customer_service FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company customer service"
    ON public.customer_service FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Service Interactions Policies
CREATE POLICY "Users can view company service interactions"
    ON public.service_interactions FOR SELECT
    USING (
        service_id IN (
            SELECT id 
            FROM public.customer_service 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage company service interactions"
    ON public.service_interactions FOR ALL
    USING (
        service_id IN (
            SELECT id 
            FROM public.customer_service 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- Automation Rules Policies
CREATE POLICY "Users can view company automation rules"
    ON public.automation_rules FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company automation rules"
    ON public.automation_rules FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- Automation Executions Policies
CREATE POLICY "Users can view company automation executions"
    ON public.automation_executions FOR SELECT
    USING (
        rule_id IN (
            SELECT id 
            FROM public.automation_rules 
            WHERE company_id IN (
                SELECT company_id 
                FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

-- AI Settings Policies
CREATE POLICY "Users can view company AI settings"
    ON public.ai_settings FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company AI settings"
    ON public.ai_settings FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- AI Interactions Policies
CREATE POLICY "Users can view company AI interactions"
    ON public.ai_interactions FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can add company AI interactions"
    ON public.ai_interactions FOR INSERT
    WITH CHECK (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- AI Suggestions Policies
CREATE POLICY "Users can view company AI suggestions"
    ON public.ai_suggestions FOR SELECT
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage company AI suggestions"
    ON public.ai_suggestions FOR ALL
    USING (
        company_id IN (
            SELECT company_id 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    ); 